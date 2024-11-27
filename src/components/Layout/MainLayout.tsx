import React, { useState } from 'react'
import { Box, IconButton, Typography, Drawer } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#343541' }}>
      {/* 移动端抽屉 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            bgcolor: '#202123',
            borderRight: '1px solid rgba(255,255,255,0.1)',
          },
          display: { md: 'none' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: '#ECECF1' }}>
            ChatGPT Clone
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#ECECF1' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* 这里可以添加抽屉内容 */}
      </Drawer>

      {/* 桌面端侧边栏 */}
      <Box
        sx={{
          width: 260,
          bgcolor: '#202123',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          color: '#ECECF1',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1,
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <MenuIcon />
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              ChatGPT Clone
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 主内容区域 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* 移动端顶部栏 */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            bgcolor: '#343541',
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              color: '#ECECF1',
              mr: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#ECECF1' }}>
            ChatGPT Clone
          </Typography>
        </Box>

        {/* 聊天内容区域 */}
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
} 