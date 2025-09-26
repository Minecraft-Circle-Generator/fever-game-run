import React, { useState, useEffect } from 'react';
import { testApiConnection, getDebugVideos, getMockVideos } from '../utils/debugVideoProvider';
import type { LatestVideo } from '../utils/videoProvider';

const DebugPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'testing' | 'success' | 'failed'>('testing');
  const [videos, setVideos] = useState<LatestVideo[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const runTests = async () => {
      addLog('开始测试 API 连接...');
      
      // 测试 API 连接
      const isConnected = await testApiConnection();
      setApiStatus(isConnected ? 'success' : 'failed');
      addLog(`API 连接状态: ${isConnected ? '成功' : '失败'}`);
      
      // 尝试获取视频
      if (isConnected) {
        addLog('尝试获取真实视频数据...');
        const realVideos = await getDebugVideos();
        if (realVideos.length > 0) {
          setVideos(realVideos);
          addLog(`成功获取 ${realVideos.length} 个视频`);
        } else {
          addLog('真实视频获取失败，使用模拟数据');
          setVideos(getMockVideos());
        }
      } else {
        addLog('API 连接失败，使用模拟数据');
        setVideos(getMockVideos());
      }
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 视频 API 调试页面</h1>
        
        {/* API 状态 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 连接状态</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            apiStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
            apiStatus === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {apiStatus === 'testing' && '🔄 测试中...'}
            {apiStatus === 'success' && '✅ 连接成功'}
            {apiStatus === 'failed' && '❌ 连接失败'}
          </div>
        </div>

        {/* 调试日志 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">调试日志</h2>
          <div className="bg-gray-50 rounded p-4 max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono text-gray-700 mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* 视频列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">获取到的视频 ({videos.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-600 mb-1">频道: {video.channelTitle}</p>
                <p className="text-xs text-gray-500">
                  发布: {new Date(video.publishedAt).toLocaleDateString()}
                </p>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  观看视频
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 环境信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">环境信息</h2>
          <div className="text-sm space-y-2">
            <p><strong>当前域名:</strong> {window.location.hostname}</p>
            <p><strong>协议:</strong> {window.location.protocol}</p>
            <p><strong>用户代理:</strong> {navigator.userAgent.substring(0, 100)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;