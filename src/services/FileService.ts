import { HistoryRecord } from '../models/DiagnosisResult';

const { ipcRenderer } = window.require('electron');

class FileService {
  // 选择单个图像文件
  async selectImage(options?: { title?: string }): Promise<string | null> {
    try {
      return await ipcRenderer.invoke('open-file-dialog', {
        properties: ['openFile'],
        filters: [{ name: '图像文件', extensions: ['jpg', 'jpeg', 'png', 'bmp'] }],
        title: options?.title || '选择图像文件'
      });
    } catch (error) {
      console.error('选择图像失败:', error);
      return null;
    }
  }
  
  // 选择文件夹
  async selectDirectory(options?: { title?: string }): Promise<string | null> {
    try {
      return await ipcRenderer.invoke('open-directory-dialog', {
        title: options?.title || '选择文件夹'
      });
    } catch (error) {
      console.error('选择文件夹失败:', error);
      return null;
    }
  }
  
  // 保存文件
  async saveFile(options: {
    title?: string;
    defaultPath?: string;
    filters?: { name: string; extensions: string[] }[];
  }): Promise<string | null> {
    try {
      return await ipcRenderer.invoke('save-dialog', {
        title: options.title || '保存文件',
        defaultPath: options.defaultPath,
        filters: options.filters || [{ name: '所有文件', extensions: ['*'] }]
      });
    } catch (error) {
      console.error('保存文件失败:', error);
      return null;
    }
  }
  
  // 导出诊断结果为CSV
  async exportDiagnosisResultsToCSV(
    records: HistoryRecord[],
    filePath: string
  ): Promise<boolean> {
    try {
      // 构建CSV内容
      const csvContent = [
        '诊断时间,疾病类型,置信度,左眼图像路径,右眼图像路径',
        ...records.map(record => 
          `${record.diagnosisTime.toLocaleString()},${record.disease},${(record.confidence * 100).toFixed(2)}%,${record.leftEyePath},${record.rightEyePath}`
        )
      ].join('\n');
      
      // 实际应用中，这里应该使用Electron的fs模块写入文件
      console.log('导出CSV内容到:', filePath);
      console.log(csvContent);
      
      return true;
    } catch (error) {
      console.error('导出CSV失败:', error);
      return false;
    }
  }
}

export default new FileService();