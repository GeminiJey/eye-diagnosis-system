import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Card,
  CardContent,
  Link
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BuildIcon from '@mui/icons-material/Build';
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import UpdateIcon from '@mui/icons-material/Update';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

const { ipcRenderer } = window.require('electron');

interface SystemInfo {
  version: string;
  electronVersion: string;
  nodeVersion: string;
  platform: string;
  arch: string;
}

const SystemInfoView: React.FC = () => {
  const [systemInfo, setSystemInfo] = React.useState<SystemInfo>({
    version: '1.0.0',
    electronVersion: process.versions.electron || '',
    nodeVersion: process.versions.node || '',
    platform: process.platform,
    arch: process.arch
  });

  const diseaseTypes = [
    '正常',
    '糖尿病',
    '青光眼',
    '白内障',
    'AMD',
    '高血压',
    '近视',
    '其他疾病/异常'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* 系统基本信息 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InfoIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                系统信息
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="系统版本" 
                  secondary={systemInfo.version} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="运行环境" 
                  secondary={`Electron ${systemInfo.electronVersion} / Node.js ${systemInfo.nodeVersion}`} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <BiotechIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="系统架构" 
                  secondary={`${systemInfo.platform} (${systemInfo.arch})`} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* 诊断能力说明 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                诊断能力
              </Typography>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              系统可识别的眼科疾病类型：
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {diseaseTypes.map((disease, index) => (
                <Card key={index} variant="outlined" sx={{ minWidth: 120 }}>
                  <CardContent>
                    <Typography variant="body2" align="center">
                      {disease}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              系统使用深度学习模型进行图像分析，支持左右眼图像的拼接处理和批量诊断功能。
            </Typography>
          </Paper>
        </Grid>

        {/* 使用说明 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DescriptionIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                使用说明
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemText 
                  primary="单图像诊断"
                  secondary="上传左右眼图像，系统将自动进行拼接和诊断分析。支持常见图像格式（JPG、PNG、BMP）。"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="批量诊断"
                  secondary="选择包含多组眼底图像的文件夹，系统将自动处理所有图像并生成诊断报告。"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="历史记录"
                  secondary="查看所有诊断历史，支持按疾病类型筛选和导出记录。"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* 更新日志和联系方式 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <UpdateIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                更新日志
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Version 1.0.0 (2024-01)"
                  secondary={
                    <>
                      • 支持左右眼图像的拼接处理<br />
                      • 实现批量诊断功能<br />
                      • 添加诊断历史记录管理<br />
                      • 优化用户界面交互体验
                    </>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="技术支持" 
                  secondary={
                    <Link href="mailto:support@example.com" underline="hover">
                      support@example.com
                    </Link>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="开源地址" 
                  secondary={
                    <Link href="https://github.com/example/eye-diagnosis" target="_blank" underline="hover">
                      GitHub Repository
                    </Link>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemInfoView;