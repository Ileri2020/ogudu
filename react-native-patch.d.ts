/**
 * react-native-patch.d.ts
 *
 * Patches missing React Native 0.76 exports that TypeScript cannot resolve
 * when using Expo's default `moduleResolution: "node"` configuration.
 *
 * Root cause: RN 0.76's types/index.d.ts re-exports from `../Libraries/...`
 * paths that are not shipped in the npm package, so TypeScript misses them.
 */
import { ComponentClass, ComponentType, ReactElement, Ref } from 'react';

declare module 'react-native' {
  // ── Image ──────────────────────────────────────────────────────────────────
  interface ImageStyle {
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    [key: string]: any;
  }

  interface ImageSourcePropType {
    uri?: string;
    headers?: { [key: string]: string };
    width?: number;
    height?: number;
  }

  interface ImageProps {
    source: ImageSourcePropType | number;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    onLoad?: () => void;
    onError?: (error: { nativeEvent: { error: string } }) => void;
    onLoadEnd?: () => void;
    defaultSource?: ImageSourcePropType | number;
    className?: string;
    [key: string]: any;
  }

  export class Image extends ComponentClass<ImageProps> {
    static getSize(uri: string, success: (w: number, h: number) => void, failure?: (error: any) => void): void;
    static prefetch(url: string): Promise<boolean>;
  }

  // ── Alert ──────────────────────────────────────────────────────────────────
  interface AlertButton {
    text?: string;
    onPress?: ((value?: string) => void) | null;
    isPreferred?: boolean;
    style?: 'default' | 'cancel' | 'destructive';
  }

  interface AlertOptions {
    cancelable?: boolean;
    userInterfaceStyle?: 'unspecified' | 'light' | 'dark';
    onDismiss?: () => void;
  }

  export class Alert {
    static alert(
      title: string,
      message?: string,
      buttons?: AlertButton[],
      options?: AlertOptions,
    ): void;
    static prompt(
      title: string,
      message?: string,
      callbackOrButtons?: ((text: string) => void) | AlertButton[],
      type?: 'default' | 'plain-text' | 'secure-text' | 'login-password',
      defaultValue?: string,
      keyboardType?: string,
    ): void;
  }

  // ── Dimensions ─────────────────────────────────────────────────────────────
  interface ScaledSize {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  }

  interface DimensionsStatic {
    get(dim: 'window' | 'screen'): ScaledSize;
    set(dims: { window?: ScaledSize; screen?: ScaledSize }): void;
    addEventListener(
      event: 'change',
      handler: (dims: { window: ScaledSize; screen: ScaledSize }) => void,
    ): { remove(): void };
  }

  export const Dimensions: DimensionsStatic;

  // ── Platform ───────────────────────────────────────────────────────────────
  interface PlatformStatic {
    OS: 'android' | 'ios' | 'windows' | 'macos' | 'web';
    Version: number | string;
    isPad: boolean;
    isTV: boolean;
    isTesting: boolean;
    select<T>(specifics: Partial<Record<'android' | 'ios' | 'native' | 'default' | 'web', T>>): T;
  }

  export const Platform: PlatformStatic;

  // ── StyleSheet ─────────────────────────────────────────────────────────────
  export interface StyleSheetStatic {
    create<T extends Record<string, any>>(styles: T): T;
    flatten<T>(style: any): T;
    hairlineWidth: number;
    absoluteFill: any;
    absoluteFillObject: any;
  }

  export const StyleSheet: StyleSheetStatic;

  // ── Types needed by Animated & IconSymbol ──────────────────────────────────
  export type StyleProp<T> = T | T[] | null | undefined | false | 0 | '';
  export type OpaqueColorValue = symbol & { __TYPE__: 'Color' };

  // ── useColorScheme ─────────────────────────────────────────────────────────
  export function useColorScheme(): 'light' | 'dark' | null | undefined;
}
