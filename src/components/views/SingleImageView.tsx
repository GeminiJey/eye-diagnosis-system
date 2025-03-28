import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Grid, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';

const { ipcRenderer } = window.require('electron');

// 定义疾病类型
const DISEASES = [
  '正常',
  '糖尿病',
  '青光眼',
  '白内障',
  'AMD',
  '高血压',
  '近视',
  '其他疾病/异常'
] as const;

type Disease = typeof DISEASES[number];

interface DiagnosisResult {
  disease: Disease;
  confidence: number;
  diagnosisTime: Date;
}

interface EyeImage {
  path: string;
  url: string;
}

const ImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(to bottom, #f0f0f0, #ffffff)',
  }
}));

const CombinedImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 250,
  background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`
}));

const SingleImageView: React.FC = () => {
  const [leftEye, setLeftEye] = useState<EyeImage | null>(null);
  const [rightEye, setRightEye] = useState<EyeImage | null>(null);
  const [combinedImageUrl, setCombinedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<'拼接' | '诊断' | ''>('');
  const [results, setResults] = useState<DiagnosisResult[]>([]);

  const handleSelectImage = async (eye: 'left' | 'right') => {
    try {
      const filePath = await ipcRenderer.invoke('open-file-dialog', {
        properties: ['openFile'],
        filters: [{ name: '图像文件', extensions: ['jpg', 'jpeg', 'png', 'bmp'] }]
      });

      if (filePath) {
        const eyeImage = {
          path: filePath,
          url: `file://${filePath}`
        };
        
        if (eye === 'left') {
          setLeftEye(eyeImage);
        } else {
          setRightEye(eyeImage);
        }
        
        // 清除之前的结果
        setCombinedImageUrl(null);
        setResults([]);
      }
    } catch (error) {
      console.error('选择图像失败:', error);
    }
  };

  const handleClearImages = () => {
    setLeftEye(null);
    setRightEye(null);
    setCombinedImageUrl(null);
    setResults([]);
  };

  const handleDiagnose = async () => {
    if (!leftEye || !rightEye) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('');

    try {
      // 模拟图像拼接过程
      setProcessingStage('拼接');
      for (let i = 0; i <= 40; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 模拟拼接完成
      // 实际应用中，这里应该调用后端API进行图像拼接
      setCombinedImageUrl(rightEye.url); // 临时使用右眼图像作为拼接结果

      // 模拟诊断过程
      setProcessingStage('诊断');
      for (let i = 40; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 模拟诊断结果
      const mockResult: DiagnosisResult = {
        disease: DISEASES[Math.floor(Math.random() * DISEASES.length)],
        confidence: 0.7 + Math.random() * 0.29,
        diagnosisTime: new Date()
      };

      setResults([mockResult]);
    } catch (error) {
      console.error('诊断失败:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
      setProgress(100);
    }
  };

  const handleExportResults = async () => {
    if (results.length === 0) return;

    try {
      const filePath = await ipcRenderer.invoke('save-dialog', {
        title: '保存诊断结果',
        defaultPath: `诊断结果_${new Date().toISOString().split('T')[0]}.csv`,
        filters: [{ name: 'CSV文件', extensions: ['csv'] }]
      });

      if (filePath) {
        const csvContent = [
          '疾病类型,置信度,诊断时间,左眼图像路径,右眼图像路径',
          ...results.map(result => 
            `${result.disease},${(result.confidence * 100).toFixed(2)}%,${result.diagnosisTime.toLocaleString()},${leftEye?.path || ''},${rightEye?.path || ''}`
          )
        ].join('\n');

        console.log('保存结果到:', filePath);
        console.log('CSV内容:', csvContent);
      }
    } catch (error) {
      console.error('导出结果失败:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            图像上传
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                左眼图像
              </Typography>
              <ImageBox onClick={() => handleSelectImage('left')}>
                {leftEye ? (
                  <img 
                    src={leftEye.url} 
                    alt="左眼" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#5990DC', mb: 1 }} />
                    <Typography color="text.primary" variant="body2">
                      点击上传左眼图像
                    </Typography>
                  </>
                )}
              </ImageBox>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                右眼图像
              </Typography>
              <ImageBox onClick={() => handleSelectImage('right')}>
                {rightEye ? (
                  <img 
                    src={rightEye.url} 
                    alt="右眼" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#5990DC', mb: 1 }} />
                    <Typography color="text.primary" variant="body2">
                      点击上传右眼图像
                    </Typography>
                  </>
                )}
              </ImageBox>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              拼接预览
            </Typography>
            <CombinedImageBox>
              {combinedImageUrl ? (
                <img 
                  src={combinedImageUrl} 
                  alt="拼接预览" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              ) : (
                <Typography color="text.secondary">
                  {leftEye && rightEye ? '点击"开始诊断"查看拼接结果' : '请先上传左右眼图像'}
                </Typography>
              )}
            </CombinedImageBox>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<SearchIcon />}
              onClick={handleDiagnose}
              disabled={!leftEye || !rightEye || isProcessing}
            >
              开始诊断
            </Button>
            <Button 
              variant="outlined"
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleClearImages}
              disabled={!leftEye && !rightEye}
            >
              清除图像
            </Button>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            诊断结果
          </Typography>
          
          <Box sx={{ flex: 1, mb: 2, overflow: 'auto' }}>
            {results.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>疾病类型</TableCell>
                      <TableCell align="right">置信度</TableCell>
                      <TableCell align="right">诊断时间</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.disease}</TableCell>
                        <TableCell align="right">
                          {(result.confidence * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {result.diagnosisTime.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary'
              }}>
                <Typography>
                  {leftEye && rightEye ? '点击"开始诊断"按钮进行诊断' : '请先上传左右眼图像'}
                </Typography>
              </Box>
            )}
          </Box>
          
          {isProcessing && (
            <Box sx={{ width: '100%', mb: 2, mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  处理中: {processingStage || '准备中'}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {progress}%
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: processingStage === '拼接' ? 'info.main' : 'primary.main',
                  }
                }} 
              />
              
              <Typography 
                variant="body2" 
                color="primary" 
                align="center" 
                sx={{ mt: 1, fontWeight: 'bold' }}
              >
                {processingStage === '拼接' 
                  ? `正在拼接左右眼图像 (${progress}%)` 
                  : processingStage === '诊断' 
                    ? `正在分析诊断图像 (${progress}%)` 
                    : `处理中 (${progress}%)`}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 0.5, display: 'block' }}>
                请耐心等待，处理速度取决于图像大小和复杂度
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="outlined"
              startIcon={<SaveAltIcon />}
              onClick={handleExportResults}
              disabled={results.length === 0}
            >
              导出结果
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SingleImageView;