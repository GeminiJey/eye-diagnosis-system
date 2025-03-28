
// 定义疾病类型
export const DISEASES = [
  '正常',
  '糖尿病',
  '青光眼',
  '白内障',
  'AMD',
  '高血压',
  '近视',
  '其他疾病/异常'
] as const;

export type Disease = typeof DISEASES[number];

import { DiagnosisResult } from '../models/DiagnosisResult';

class ApiService {
  // 模拟单图像诊断
  async diagnoseSingleImage(leftEyePath: string, rightEyePath: string): Promise<DiagnosisResult> {
    // 模拟API调用延迟
    await this.delay(2000);
    
    // 模拟诊断结果
    return {
      disease: DISEASES[Math.floor(Math.random() * DISEASES.length)],
      confidence: 0.7 + Math.random() * 0.29,
      diagnosisTime: new Date()
    };
  }
  
  // 模拟批量诊断
  async diagnoseBatchImages(
    imagePairs: Array<{ leftEyePath: string; rightEyePath: string }>,
    progressCallback?: (progress: number) => void
  ): Promise<DiagnosisResult[]> {
    const results: DiagnosisResult[] = [];
    
    for (let i = 0; i < imagePairs.length; i++) {
      // 模拟API调用延迟
      await this.delay(1000);
      
      // 生成随机诊断结果
      const result: DiagnosisResult = {
        disease: DISEASES[Math.floor(Math.random() * DISEASES.length)],
        confidence: 0.7 + Math.random() * 0.29,
        diagnosisTime: new Date()
      };
      
      results.push(result);
      
      // 报告进度
      if (progressCallback) {
        progressCallback((i + 1) / imagePairs.length * 100);
      }
    }
    
    return results;
  }
  
  // 模拟图像拼接
  async combineImages(leftEyePath: string, rightEyePath: string): Promise<string> {
    // 模拟API调用延迟
    await this.delay(1500);
    
    // 实际应用中，这里应该返回拼接后的图像路径
    // 这里我们简单地返回右眼图像路径作为模拟
    return rightEyePath;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ApiService();