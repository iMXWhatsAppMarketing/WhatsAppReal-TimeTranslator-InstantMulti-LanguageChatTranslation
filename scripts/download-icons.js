import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 禁用 SSL 验证（仅用于开发环境）
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// 读取环境变量
const loadEnvFile = (mode = 'dev') => {
  const envFile = path.resolve(__dirname, `../.env.${mode}`);
  const envLocalFile = path.resolve(__dirname, `../.env.${mode}.local`);
  const envDefault = path.resolve(__dirname, '../.env');

  const envFiles = [envDefault, envFile, envLocalFile];
  const env = {};

  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length) {
            env[key.trim()] = valueParts
              .join('=')
              .trim()
              .replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  }

  return env;
};

// 下载文件（带重试机制）
const downloadFile = async (url, outputPath, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`📥 正在下载图标 (尝试 ${i + 1}/${retries}): ${url}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000 // 30秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      // 确保目录存在
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, uint8Array);
      console.log(`✅ 图标已保存: ${path.relative(process.cwd(), outputPath)}`);
      return true;
    } catch (error) {
      console.log(`⚠️  尝试 ${i + 1} 失败: ${error.message}`);

      if (i === retries - 1) {
        throw error;
      }

      // 等待后重试
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

// 使用curl作为备用下载方式
const downloadWithCurl = async (url, outputPath) => {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  try {
    console.log('🔄 尝试使用 curl 下载...');

    // 确保目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const command = `curl -k -L -o "${outputPath}" "${url}"`;
    await execAsync(command);

    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      console.log('✅ curl 下载成功');
      return true;
    } else {
      throw new Error('curl 下载失败');
    }
  } catch (error) {
    console.log('❌ curl 下载失败:', error.message);
    return false;
  }
};

// 主函数
const downloadIcons = async () => {
  try {
    const mode = process.argv[2] || 'dev';
    const env = loadEnvFile(mode);

    const logoUrl = env.VITE_APP_LOGO_URL;
    if (!logoUrl) {
      console.log('⚠️  未找到 VITE_APP_LOGO_URL 环境变量，跳过图标下载');
      return;
    }

    // 如果是本地文件路径，跳过下载
    if (!logoUrl.startsWith('http')) {
      console.log('✅ 检测到本地图标路径，无需下载');
      return;
    }

    const iconsDir = path.resolve(__dirname, '../src/assets/images');
    const iconSizes = [16, 32, 48, 128];

    // 删除已存在的图标文件
    console.log('🗑️  清理旧图标文件...');
    for (const size of iconSizes) {
      const iconPath = path.join(iconsDir, `icon-${size}.png`);
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath);
        console.log(`🗑️  已删除: icon-${size}.png`);
      }
    }

    // 删除可能存在的原始图标文件
    const originalIconPath = path.join(iconsDir, 'original-icon.png');
    if (fs.existsSync(originalIconPath)) {
      fs.unlinkSync(originalIconPath);
      console.log('🗑️  已删除: original-icon.png');
    }

    console.log(`🚀 [图标下载] 开始下载图标...`);
    console.log(`📁 保存目录: ${path.relative(process.cwd(), iconsDir)}`);

    // 下载原始图标
    let downloadSuccess = false;

    try {
      await downloadFile(logoUrl, originalIconPath);
      downloadSuccess = true;
    } catch (error) {
      console.log('⚠️  fetch 下载失败，尝试备用方案...');
      downloadSuccess = await downloadWithCurl(logoUrl, originalIconPath);
    }

    if (!downloadSuccess) {
      throw new Error('所有下载方式都失败了');
    }

    // 复制为不同尺寸
    for (const size of iconSizes) {
      const iconPath = path.join(iconsDir, `icon-${size}.png`);
      fs.copyFileSync(originalIconPath, iconPath);
      console.log(`📋 已复制: icon-${size}.png`);
    }

    // 删除原始文件
    fs.unlinkSync(originalIconPath);

    console.log('🎉 图标下载完成！');
  } catch (error) {
    console.error('❌ 图标下载失败:', error.message);
    console.log('⚠️  继续构建，请稍后手动下载图标或检查网络连接');
    console.log('💡 你也可以手动将图标文件放到 src/assets/images/ 目录下');

    // 不退出进程，允许构建继续
    // process.exit(1);
  }
};

// 执行
downloadIcons();
