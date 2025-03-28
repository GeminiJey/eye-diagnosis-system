import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Grid,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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

interface HistoryRecord {
  id: string;
  leftEyePath: string;
  rightEyePath: string;
  disease: Disease;
  confidence: number;
  diagnosisTime: Date;
  combinedImagePath?: string;
}

interface ImagePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  record: HistoryRecord | null;
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ open, onClose, record }) => {
  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>诊断记录详情</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              诊断时间：{record.diagnosisTime.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              诊断结果：{record.disease} （置信度：{(record.confidence * 100).toFixed(2)}%）
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>左眼图像</Typography>
            <Box sx={{ 
              width: '100%', 
              height: 200, 
              bgcolor: 'grey.100',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src={`file://${record.leftEyePath}`}
                alt="左眼"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>右眼图像</Typography>
            <Box sx={{ 
              width: '100%', 
              height: 200, 
              bgcolor: 'grey.100',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src={`file://${record.rightEyePath}`}
                alt="右眼"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </Box>
          </Grid>
          {record.combinedImagePath && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>拼接结果</Typography>
              <Box sx={{ 
                width: '100%', 
                height: 250, 
                bgcolor: 'grey.100',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={`file://${record.combinedImagePath}`}
                  alt="拼接结果"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
};

const HistoryView: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>(() => {
    // 模拟历史记录数据
    return Array(20).fill(0).map((_, index) => ({
      id: `record_${index + 1}`,
      leftEyePath: `/path/to/left_eye_${index + 1}.jpg`,
      rightEyePath: `/path/to/right_eye_${index + 1}.jpg`,
      disease: DISEASES[Math.floor(Math.random() * DISEASES.length)],
      confidence: 0.7 + Math.random() * 0.29,
      diagnosisTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      combinedImagePath: `/path/to/combined_${index + 1}.jpg`
    }));
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | ''>('');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterDisease = (disease: Disease | '') => {
    setSelectedDisease(disease);
    setPage(0);
  };

  const handleExportResults = async () => {
    try {
      const filePath = await ipcRenderer.invoke('save-dialog', {
        title: '导出历史记录',
        defaultPath: `诊断历史记录_${new Date().toISOString().split('T')[0]}.csv`,
        filters: [{ name: 'CSV文件', extensions: ['csv'] }]
      });

      if (filePath) {
        const csvContent = [
          '诊断时间,疾病类型,置信度,左眼图像路径,右眼图像路径',
          ...filteredRecords.map(record => 
            `${record.diagnosisTime.toLocaleString()},${record.disease},${(record.confidence * 100).toFixed(2)}%,${record.leftEyePath},${record.rightEyePath}`
          )
        ].join('\n');

        console.log('保存历史记录到:', filePath);
        console.log('CSV内容:', csvContent);
      }
    } catch (error) {
      console.error('导出历史记录失败:', error);
    }
  };

  const handlePreviewRecord = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setIsPreviewOpen(true);
  };

  const filteredRecords = records
    .filter(record => 
      (searchTerm === '' || 
        record.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosisTime.toLocaleString().includes(searchTerm)
      ) &&
      (selectedDisease === '' || record.disease === selectedDisease)
    )
    .sort((a, b) => b.diagnosisTime.getTime() - a.diagnosisTime.getTime());

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" color="primary">
                诊断历史记录
              </Typography>
              <Button
                variant="outlined"
                startIcon={<SaveAltIcon />}
                onClick={handleExportResults}
                disabled={filteredRecords.length === 0}
              >
                导出记录
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="搜索疾病类型或诊断时间..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="全部"
                color={selectedDisease === '' ? 'primary' : 'default'}
                onClick={() => handleFilterDisease('')}
              />
              {DISEASES.map((disease) => (
                <Chip
                  key={disease}
                  label={disease}
                  color={selectedDisease === disease ? 'primary' : 'default'}
                  onClick={() => handleFilterDisease(disease)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>诊断时间</TableCell>
                    <TableCell>疾病类型</TableCell>
                    <TableCell align="right">置信度</TableCell>
                    <TableCell align="center">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" />
                            {record.diagnosisTime.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell>{record.disease}</TableCell>
                        <TableCell align="right">
                          {(record.confidence * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handlePreviewRecord(record)}
                            title="查看详情"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={filteredRecords.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="每页显示："
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} 条，共 ${count} 条`
              }
            />
          </Grid>
        </Grid>
      </Paper>

      <ImagePreviewDialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        record={selectedRecord}
      />
    </Box>
  );
};

export default HistoryView;