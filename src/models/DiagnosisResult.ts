// 从 ApiService 导入疾病类型
import { DISEASES } from '../services/ApiService';

// 类型定义
export type Disease = typeof DISEASES[number];

export interface DiagnosisResult {
  disease: Disease;
  confidence: number;
  diagnosisTime: Date;
}

export interface HistoryRecord extends DiagnosisResult {
  id: string;
  leftEyePath: string;
  rightEyePath: string;
  combinedImagePath?: string;
}

export interface ImagePair {
  id: string;
  leftEye: {
    path: string;
    name: string;
  };
  rightEye: {
    path: string;
    name: string;
  };
}