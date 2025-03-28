import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Grid, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

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

interface ImagePair {
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

interface DiagnosisResult {
  id: string;
  leftEyePath: string;
  rightEyePath: string;
  disease: Disease;
  confidence: number;
  diagnosisTime: Date;
}

const ImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: 400,
  background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  overflow: 'hidden'
}));

const MultiImageView: React.FC = () => {
  const [imagePairs, setImagePairs] = useState<ImagePair[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPair, setCurrentPair] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<'拼接' | '诊断' | ''>('');
  const [results, setResults] = useState<DiagnosisResult[]>([]);

  const handleSelectFolders = async () => {
    try {
      // 选择左眼图像文件夹
      const leftFolderPath = await ipcRenderer.invoke('open-directory-dialog', {
        title: '选择左眼图像文件夹'
      });
      
      if (!leftFolderPath) return;

      // 选择右眼图像文件夹
      const rightFolderPath = await ipcRenderer.invoke('open-directory-dialog', {
        title: '选择右眼图像文件夹'
      });

      if (!rightFolderPath) return;

      // 模拟读取文件夹中的图像
      // 在实际应用中，这里应该读取实际的文件列表并匹配左右眼图像
      const mockPairs: ImagePair[] = Array(5).fill(0).map((_, index) => ({
        id: `pair_${index + 1}`,
        leftEye: {
          path: `${leftFolderPath}/left_${index + 1}.jpg`,
          name: `左眼图像 ${index + 1}`
        },
        rightEye: {
          path: `${rightFolderPath}/right_${index + 1}.jpg`,
          name: `右眼图像 ${index + 1}`
        }
      }));

      setImagePairs(mockPairs);
      setResults([]);
    } catch (error) {
      console.error('选择文件夹失败:', error);
    }
  };

  const handleClearFiles = () => {
    setImagePairs([]);
    setResults([]);
  };

  const handleBatchDiagnose = async () => {
    if (imagePairs.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setCurrentPair(0);
    setProcessingStage('');
    const newResults: DiagnosisResult[] = [];

    try {
      const totalPairs = imagePairs.length;

      for (let i = 0; i < totalPairs; i++) {
        setCurrentPair(i + 1);
        
        // 模拟拼接过程
        setProcessingStage('拼接');
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress((i * 100 / totalPairs) + (25 / totalPairs));
        
        // 更新进度
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress((i * 100 / totalPairs) + (50 / totalPairs));

        // 模拟诊断过程
        setProcessingStage('诊断');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockResult: DiagnosisResult = {
          id: imagePairs[i].id,
          leftEyePath: imagePairs[i].leftEye.path,
          rightEyePath: imagePairs[i].rightEye.path,
          disease: DISEASES[Math.floor(Math.random() * DISEASES.length)],
          confidence: 0.7 + Math.random() * 0.29,
          diagnosisTime: new Date()
        };
        
        newResults.push(mockResult);
        setProgress(((i + 1) / totalPairs) * 100);
      }

      setResults(newResults);
    } catch (error) {
      console.error('批量诊断失败:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleExportResults = async () => {
    if (results.length === 0) return;

    try {
      const filePath = await ipcRenderer.invoke('save-dialog', {
        title: '保存批量诊断结果',
        defaultPath: `批量诊断结果_${new Date().toISOString().split('T')[0]}.csv`,
        filters: [{ name: 'CSV文件', extensions: ['csv'] }]
      });

      if (filePath) {
        const csvContent = [
          '左眼图像路径,右眼图像路径,疾病类型,置信度,诊断时间',
          ...results.map(result => 
            `${result.leftEyePath},${result.rightEyePath},${result.disease},${(result.confidence * 100).toFixed(2)}%,${result.diagnosisTime.toLocaleString()}`
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
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            批量图像预览
          </Typography>
          
          <ImageBox>
            {imagePairs.length > 0 ? (
              <ImageList sx={{ width: '100%', height: 450 }} cols={2} rowHeight={164}>
                {imagePairs.map((pair) => (
                  <React.Fragment key={pair.id}>
                    <ImageListItem>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(to bottom, #f8f8f8, #ffffff)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                          border: '1px solid',
                          borderColor: 'primary.main'
                        }}
                      >
                        <RemoveRedEyeIcon color="primary" sx={{ mb: 1 }} />
                        <Typography variant="caption" align="center" noWrap>
                          {pair.leftEye.name}
                        </Typography>
                      </Box>
                    </ImageListItem>
                    <ImageListItem>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(to bottom, #f8f8f8, #ffffff)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                          border: '1px solid',
                          borderColor: 'primary.main'
                        }}
                      >
                        <RemoveRedEyeIcon color="primary" sx={{ mb: 1 }} />
                        <Typography variant="caption" align="center" noWrap>
                          {pair.rightEye.name}
                        </Typography>
                      </Box>
                    </ImageListItem>
                  </React.Fragment>
                ))}
              </ImageList>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <FolderOpenIcon sx={{ fontSize: 48, color: '#5990DC', mb: 2 }} />
                <Typography color="text.primary" align="center">
                  点击选择文件夹以批量导入左右眼图像
                </Typography>
                <Typography color="text.secondary" variant="caption" align="center" sx={{ mt: 1 }}>
                  请确保左右眼图像文件夹中的图像一一对应
                </Typography>
              </Box>
            )}
          </ImageBox>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<FolderOpenIcon />}
              onClick={handleSelectFolders}
            >
              选择图像文件夹
            </Button>
            <Button 
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearFiles}
              disabled={imagePairs.length === 0}
            >
              清除文件
            </Button>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            批量诊断结果
          </Typography>
          
          <Box sx={{ flex: 1, mb: 2, overflow: 'auto' }}>
            {results.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>图像对</TableCell>
                      <TableCell>疾病类型</TableCell>
                      <TableCell align="right">置信度</TableCell>
                      <TableCell align="right">诊断时间</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={result.id}>
                        <TableCell>{`图像对 ${index + 1}`}</TableCell>
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
                  {imagePairs.length > 0 
                    ? '点击"开始批量诊断"按钮进行诊断' 
                    : '请先选择左右眼图像文件夹'}
                </Typography>
              </Box>
            )}
          </Box>
          
          {isProcessing && (
            <Box sx={{ width: '100%', mb: 2, mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  处理中: 图像对 {currentPair}/{imagePairs.length}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {progress.toFixed(1)}%
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'primary.main',
                  }
                }} 
              />
              
              <Typography 
                variant="body2" 
                color="primary" 
                align="center" 
                sx={{ mt: 1, fontWeight: 'bold' }}
              >
                {processingStage ? `正在${processingStage}图像 (${progress.toFixed(1)}%)` : `正在批量处理中 (${progress.toFixed(1)}%)`}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 0.5, display: 'block' }}>
                请耐心等待，处理速度取决于图像大小和数量
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<PlayArrowIcon />}
              onClick={handleBatchDiagnose}
              disabled={imagePairs.length === 0 || isProcessing}
            >
              开始批量诊断
            </Button>
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

export default MultiImageView;