<template>
  <div class="file-upload-container">
    <n-upload
      :max="max"
      :file-list="fileList"
      :on-update:file-list="handleFileListUpdate"
      :on-before-upload="handleBeforeUpload"
      :custom-request="handleCustomRequest"
      :accept="acceptTypes"
      directory-dnd
      drag-over-text="拖拽文件到此处"
    >
      <n-upload-dragger>
        <div>点击或拖拽上传</div>
        <n-p depth="3" style="margin: 8px 0 0 0"> 支持 {{ acceptTypesText }} 格式文件，最大 {{ maxSizeText }} </n-p>
      </n-upload-dragger>
    </n-upload>
  </div>
</template>

<script setup>
import { useMessage } from 'naive-ui';
import { ensureArray } from '@/shared';

// 定义 props
const props = defineProps({
  modelValue: {
    type: [Object, Array],
    default: () => null
  },
  allowedTypes: {
    type: [Array, String],
    default: () => []
  },
  maxSize: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['update:modelValue']);

const fileList = ref([]);

const message = useMessage();

const ensureAcceptTypes = computed(() => ensureArray(props.allowedTypes));
const acceptTypes = computed(() => (ensureAcceptTypes.value.length > 0 ? ensureAcceptTypes.value.join(',') : '*'));
const acceptTypesText = computed(() => (ensureAcceptTypes.value.length > 0 ? ensureAcceptTypes.value.join(', ') : '所有类型'));
const maxSizeText = computed(() => (props.maxSize >= 1024 ? `${(props.maxSize / 1024).toFixed(1)}GB` : `${props.maxSize}MB`));

// 监听 v-model 值的变化（用于回显/重置）
watch(
  () => props.modelValue,
  (newValue) => {
    const ensureValue = ensureArray(newValue);
    if (!ensureValue?.length) {
      fileList.value = [];
    } else {
      fileList.value = ensureValue.map((fileObj) => {
        // 兼容历史数据和 File 对象
        const file = fileObj.file || fileObj;
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          status: 'finished',
          url: file.url, // 如果有历史文件的 url
          file
        };
      });
    }
  },
  { immediate: true }
);

let lastFileKey = '';
// 如果传入:file-list="fileList"，n-upload 每次内部 file-list 变化都会触发 on-update:file-list，又因为files 赋值给 fileList，形成受控回流。所以需要对比文件的 key 来避免重复触发
const handleFileListUpdate = (files) => {
  const key = files.map((f) => `${f.name}_${f.lastModified}_${f.size}`).join(',');
  if (key === lastFileKey) return;
  lastFileKey = key;

  fileList.value = files;
  if (files.length === 0) {
    emit('update:modelValue', props.max === 1 ? null : []);
  } else {
    const fileData = files.map((fileItem) => fileItem.file || fileItem);
    emit('update:modelValue', props.max === 1 ? fileData[0] : fileData);
  }
};

const showError = (errorMsg) => {
  if (message) message.error(errorMsg);
};

const handleBeforeUpload = (data) => {
  const { file } = data;
  const actualFile = file.file || file;
  const fileName = actualFile.name.toLowerCase();
  if (ensureAcceptTypes.value.length > 0) {
    const isValidType = ensureAcceptTypes.value.some((type) => fileName.endsWith(type.toLowerCase()));
    if (!isValidType) {
      showError(`只支持 ${acceptTypesText.value} 格式文件`);
      return false;
    }
  }
  const maxSizeBytes = props.maxSize * 1024 * 1024;
  if (actualFile.size > maxSizeBytes) {
    showError(`文件大小不能超过 ${maxSizeText.value}`);
    return false;
  }
  return true;
};

const handleCustomRequest = ({ file, onFinish, onError }) => {
  const actualFile = file.file || file;
  try {
    if (!actualFile || typeof actualFile.name !== 'string') {
      throw new Error('无效的文件对象');
    }
    onFinish();
  } catch (err) {
    onError();
    showError(err.message);
  }
};

defineExpose({
  clearData: () => {
    fileList.value = [];
    emit('update:modelValue', props.max === 1 ? null : []);
  }
});
</script>

<style scoped>
.file-upload-container {
  padding: 16px;
}
</style>
