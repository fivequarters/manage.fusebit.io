/// <reference types="react-scripts" />

declare module '*.mp4';

interface Window {
  editor?: Context;
  dataLayer: { [key]: string }[];
}
