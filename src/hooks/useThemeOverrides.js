/**
 * Naive UI 主题配置 Hook
 * Element UI 蓝色主题风格
 */
export const useThemeOverrides = () => {
  const themeOverrides = {
    common: {
      // 主色调系列 - Element UI Blue
      primaryColor: '#409EFF',
      primaryColorHover: '#66B1FF',
      primaryColorPressed: '#337ECC',
      primaryColorSuppl: '#409EFF',

      // 信息色调
      infoColor: '#409EFF',
      infoColorHover: '#66B1FF',
      infoColorPressed: '#337ECC',
      infoColorSuppl: '#409EFF',

      // 成功色调
      successColor: '#67C23A',
      successColorHover: '#85CE61',
      successColorPressed: '#529B2E',
      successColorSuppl: '#67C23A',

      // 警告色调
      warningColor: '#E6A23C',
      warningColorHover: '#EBB563',
      warningColorPressed: '#B88230',
      warningColorSuppl: '#E6A23C',

      // 错误色调
      errorColor: '#F56C6C',
      errorColorHover: '#F78989',
      errorColorPressed: '#C45656',
      errorColorSuppl: '#F56C6C'
    },
    Button: {
      textColorPrimary: '#FFFFFF',
      textColorHoverPrimary: '#FFFFFF',
      textColorPressedPrimary: '#FFFFFF',
      textColorFocusPrimary: '#FFFFFF',
      colorPrimary: '#409EFF',
      colorHoverPrimary: '#66B1FF',
      colorPressedPrimary: '#337ECC',
      colorFocusPrimary: '#409EFF',
      borderPrimary: '#409EFF',
      borderHoverPrimary: '#66B1FF',
      borderPressedPrimary: '#337ECC',
      borderFocusPrimary: '#409EFF'
    },
    Switch: {
      railColorActive: '#409EFF',
      railColorActiveHover: '#66B1FF',
      railColorActivePressed: '#337ECC',
      buttonColorActive: '#FFFFFF'
    },
    Radio: {
      buttonColorActive: '#409EFF',
      dotColorActive: '#409EFF',
      buttonBorderColorActive: '#409EFF'
    },
    Menu: {
      itemColorActiveCollapsed: 'rgba(64, 158, 255, 0.1)',
      itemColorActive: 'rgba(64, 158, 255, 0.1)',
      itemTextColorActive: '#fff',
      itemTextColorActiveHover: '#fff',
      itemIconColorActive: '#fff',
      itemIconColorActiveHover: '#fff'
    }
  };

  return {
    themeOverrides
  };
};
