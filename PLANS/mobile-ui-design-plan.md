# China Trade Assistant Pro - Mobile UI/UX Design Plan

## Executive Summary

A comprehensive design system for React Native (Expo) mobile application focused on:
- **Responsive design** for all screen sizes
- **Compact components** maximizing content visibility
- **Smooth interactions** with haptic feedback
- **Accessibility** (WCAG compliance)
- **Performance** optimization

---

## 1. Design System Architecture

### 1.1 Color Palette

```typescript
// Design Tokens - Colors
export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',   // lightest
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // main
    600: '#2563eb', // darker
    700: '#1d4ed8',
    800: '#1e40af', // darkest
    900: '#1e3a8a',
  },
  
  // Secondary Colors
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e', // main green
    600: '#16a34a',
  },
  
  // Accent Colors
  accent: {
    amber: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6',
  },
  
  // Neutral Colors
  neutral: {
    white: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    black: '#000000',
  },
  
  // Semantic Colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Dark Mode Colors
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    text: '#f8fafc',
    textMuted: '#94a3b8',
  },
};
```

### 1.2 Typography System

```typescript
// Typography Scale (based on iOS HIG)
export const typography = {
  // Font Families
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    arabic: 'System',
    chinese: 'PingFang SC',
  },
  
  // Font Sizes (in points)
  sizes: {
    // Small - for captions, labels
    xs: 11,    // 11pt
    sm: 13,    // 13pt
    
    // Medium - for body text
    base: 15,   // 15pt
    md: 17,     // 17pt
    
    // Large - for headings
    lg: 20,    // 20pt
    xl: 22,    // 22pt
    '2xl': 25, // 25pt
    '3xl': 29, // 29pt
    '4xl': 34, // 34pt - large title
    
    // Display
    '5xl': 43, // 43pt
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font Weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### 1.3 Spacing System (8pt Grid)

```typescript
// Spacing Scale (8pt grid)
export const spacing = {
  // Core spacing
  0: 0,
  0.5: 2,   // 2pt - minimal
  1: 4,      // 4pt
  1.5: 6,    // 6pt
  2: 8,      // 8pt - base unit
  2.5: 10,   // 10pt
  3: 12,     // 12pt
  3.5: 14,   // 14pt
  4: 16,     // 16pt - common
  5: 20,     // 20pt
  6: 24,     // 24pt
  7: 28,     // 28pt
  8: 32,     // 32pt
  9: 36,     // 36pt
  10: 40,    // 40pt
  12: 48,    // 48pt
  16: 64,    // 64pt
};
```

### 1.4 Border Radius

```typescript
// Border Radius Scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999, // pill shape
};
```

---

## 2. Responsive Breakpoints

### 2.1 Device Categories

```typescript
// Responsive Breakpoints (points)
export const breakpoints = {
  // Small phones
  xs: 0,
  
  // Standard phones
  sm: 375,
  
  // Large phones (Plus, Pro Max)
  md: 414,
  
  // Tablets portrait
  lg: 768,
  
  // Tablets landscape
  xl: 1024,
  
  // Desktop
  '2xl': 1280,
};
```

### 2.2 Adaptive Component Sizes

```typescript
// Component size variants
export const componentSizes = {
  // Button sizes (height in points)
  button: {
    xs: 32,   // small buttons
    sm: 40,   // compact
    md: 48,   // default - 48pt minimum for touch
    lg: 56,   // large
    xl: 64,   // extra large
  },
  
  // Icon sizes (points)
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
  },
  
  // Input field heights
  input: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  
  // Touch target minimum (44pt iOS, 48dp Android)
  touchTarget: {
    minimum: 44,
    comfortable: 48,
  },
  
  // Card sizes (width percentage)
  card: {
    full: '100%',
    half: '48%',
    third: '31%',
    quarter: '23%',
  },
};
```

---

## 3. Core Components

### 3.1 Button Component

```typescript
// Button.tsx - Flexible button with variants

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, componentSizes, borderRadius } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const height = componentSizes.button[size];
  
  const getBackgroundColor = () => {
    if (disabled) return colors.neutral[300];
    switch (variant) {
      case 'primary': return colors.primary[600];
      case 'secondary': return colors.secondary[500];
      case 'danger': return colors.semantic.error;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.neutral[500];
    switch (variant) {
      case 'outline': return colors.primary[600];
      case 'ghost': return colors.neutral[700];
      default: return colors.neutral.white;
    }
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          height,
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: colors.primary[600],
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 20,
    gap: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
});
```

### 3.2 Card Component

```typescript
// Card.tsx - Adaptive card for lists and content

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof spacing;
  style?: ViewStyle;
}

export function Card({ children, onPress, variant = 'elevated', padding = 4, style }: CardProps) {
  const cardStyles = [
    styles.card,
    { padding: spacing[padding] },
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'filled' && styles.filled,
    style,
  ];
  
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyles,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  
  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral.white,
  },
  elevated: {
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  filled: {
    backgroundColor: colors.neutral[50],
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
```

### 3.3 Input Component

```typescript
// Input.tsx - Text input with validation states

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, componentSizes, borderRadius, spacing } from '../theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helper?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  helper,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  disabled = false,
  style,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const getBorderColor = () => {
    if (error) return colors.semantic.error;
    if (isFocused) return colors.primary[500];
    return colors.neutral[300];
  };
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          {
            borderColor: getBorderColor(),
            minHeight: multiline ? componentSizes.input.md * numberOfLines : componentSizes.input.md,
            backgroundColor: disabled ? colors.neutral[100] : colors.neutral.white,
          },
        ]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[1],
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
  },
  input: {
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    fontSize: 15,
    color: colors.neutral[900],
  },
  error: {
    fontSize: 12,
    color: colors.semantic.error,
  },
  helper: {
    fontSize: 12,
    color: colors.neutral[500],
  },
});
```

### 3.4 List Item Component

```typescript
// ListItem.tsx - Adaptive list row

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, componentSizes } from '../theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
}

export function ListItem({
  title,
  subtitle,
  leftElement,
  rightElement,
  onPress,
  showDivider = true,
}: ListItemProps) {
  const content = (
    <View style={[styles.container, showDivider && styles.divider]}>
      {leftElement && <View style={styles.left}>{leftElement}</View>}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
        )}
      </View>
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </View>
  );
  
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }
  
  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.neutral.white,
    minHeight: componentSizes.touchTarget.comfortable,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral[200],
  },
  left: {
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
  },
  right: {
    marginLeft: spacing[3],
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral[900],
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral[500],
    marginTop: 2,
  },
  pressed: {
    backgroundColor: colors.neutral[100],
  },
});
```

---

## 4. Navigation Components

### 4.1 Tab Bar

```typescript
// TabBar.tsx - Bottom tab navigation

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export function TabBar() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerStyle: styles.header,
        headerTintColor: colors.neutral.white,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
        }}
      />
      {/* More tabs... */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 84, // iOS safe area + tab bar
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: colors.neutral.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neutral[200],
  },
  header: {
    backgroundColor: colors.primary[800],
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: colors.neutral[500],
    marginTop: 2,
  },
  labelFocused: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
```

---

## 5. Gesture & Interaction

### 5.1 Haptic Feedback

```typescript
// haptics.ts - Haptic feedback utilities

import { Platform } from 'react-native';

// For Expo, use expo-haptics
import * as Haptics from 'expo-haptics';

export const haptics = {
  // Light impact - for selections
  light: () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  
  // Medium impact - for button presses
  medium: () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  
  // Heavy impact - for important actions
  heavy: () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  
  // Success notification
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  
  // Warning notification
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  
  // Error notification
  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  
  // Selection changed
  selection: () => {
    Haptics.selectionAsync();
  },
};
```

### 5.2 Pull-to-Refresh

```typescript
// usePullToRefresh.ts - Custom pull to refresh hook

import { useCallback } from 'react';
import { RefreshControl } from 'react-native';

export function usePullToRefresh(onRefresh: () => void) {
  const renderRefreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={false}
        onRefresh={onRefresh}
        tintColor={colors.primary[600]}
        colors={[colors.primary[600]]}
      />
    );
  }, [onRefresh]);
  
  return { renderRefreshControl };
}
```

---

## 6. Accessibility

### 6.1 Accessibility Props

```typescript
// accessibility.ts - Accessibility utilities

export const accessibility = {
  // Label for screen readers
  label: (text: string) => ({
    accessible: true,
    accessibilityLabel: text,
  }),
  
  // Hint for screen readers
  hint: (text: string) => ({
    accessibilityHint: text,
  }),
  
  // Role for custom elements
  role: (role: 'button' | 'image' | 'text' | 'header' | 'link') => ({
    accessibilityRole: role,
  }),
  
  // State for screen readers
  state: {
    disabled: { accessibilityState: { disabled: true } },
    selected: { accessibilityState: { selected: true } },
    checked: { accessibilityState: { checked: true } },
    busy: { accessibilityState: { busy: true } },
  },
  
  // Minimum touch target
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
  },
  
  // Contrast ratios (WCAG AA)
  contrast: {
    normal: 4.5, // 4.5:1 for normal text
    large: 3,   // 3:1 for large text
  },
};
```

---

## 7. Performance Optimization

### 7.1 Virtualized Lists

```typescript
// Optimized FlatList configuration
const optimizedListConfig = {
  // Window size for virtualization
  windowSize: 10,
  
  // Remove offscreen items
  removeClippedSubviews: true,
  
  // Maximum render iterations
  maxToRenderPerBatch: 10,
  
  // Animation frame budget
  updateIntervalBatched: 16,
  
  // Initial number to render
  initialNumToRender: 8,
  
  // Get item layout for performance
  getItemLayout: (data: any[], index: number) => ({
    length: 72, // item height
    offset: 72 * index,
    index,
  }),
};

// Usage
<FlatList
  {...optimizedListConfig}
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
/>
```

### 7.2 Image Optimization

```typescript
// Using expo-image for optimization
import { Image } from 'expo-image';

<Image
  source={uri}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  style={styles.image}
/>
```

---

## 8. File Structure

```
src/
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── borderRadius.ts
│   └── index.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── ListItem.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── IconButton.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── TabBar.tsx
│   │   ├── SafeView.tsx
│   │   └── index.ts
│   └── forms/
│       ├── FormField.tsx
│       ├── Select.tsx
│       └── index.ts
├── hooks/
│   ├── usePullToRefresh.ts
│   ├── useInfiniteScroll.ts
│   ├── useHaptics.ts
│   └── index.ts
├── utils/
│   ├── haptics.ts
│   ├── accessibility.ts
│   └── index.ts
└── types/
    └── component.ts
```

---

## 9. Implementation Checklist

### Phase 1: Core Components (Week 1)
- [ ] Create theme system (colors, typography, spacing)
- [ ] Build Button, Card, Input components
- [ ] Build ListItem, Badge, Avatar components
- [ ] Set up navigation with tabs

### Phase 2: Lists & Performance (Week 2)
- [ ] Optimize FlatList configurations
- [ ] Implement pull-to-refresh
- [ ] Add lazy loading for images
- [ ] Implement haptic feedback

### Phase 3: Accessibility (Week 3)
- [ ] Add accessibility labels
- [ ] Test with VoiceOver/TalkBack
- [ ] Ensure touch targets meet minimums
- [ ] Verify color contrast

### Phase 4: Polish (Week 4)
- [ ] Add animations and transitions
- [ ] Test on multiple device sizes
- [ ] Performance profiling
- [ ] Final UX refinements

---

## 10. Testing Checklist

- [ ] iPhone SE (small screen)
- [ ] iPhone 14/15 (standard)
- [ ] iPhone Pro Max (large)
- [ ] iPad (tablet)
- [ ] Android devices
- [ ] Dark mode
- [ ] Accessibility testing
- [ ] Performance testing
