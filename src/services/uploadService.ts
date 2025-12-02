/**
 * 上传服务
 * 用于将文件上传到后端服务器
 */

export interface UploadResponse {
  success: boolean;
  message: string;
  url?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

/**
 * 上传单个图片到服务器
 * @param file 要上传的文件
 * @param onProgress 上传进度回调
 * @returns 上传响应
 */
export const uploadImage = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // 检查后端是否可用
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const healthCheck = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
      signal: controller.signal
    }).then(response => {
      clearTimeout(timeoutId);
      return response;
    }).catch(() => {
      clearTimeout(timeoutId);
      return null;
    });

    if (!healthCheck || !healthCheck.ok) {
      throw new Error('后端服务未启动，请确保运行了 npm start');
    }

    const request = new XMLHttpRequest();

    // 监听上传进度
    if (onProgress) {
      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percent,
          });
        }
      });
    }

    return new Promise((resolve, reject) => {
      request.addEventListener('load', () => {
        if (request.status === 200) {
          try {
            const response = JSON.parse(request.responseText);
            console.log('✅ 上传成功:', response);
            resolve(response);
          } catch (error) {
            reject(new Error('服务器响应格式错误'));
          }
        } else {
          try {
            const error = JSON.parse(request.responseText);
            reject(new Error(error.message || `上传失败 (${request.status})`));
          } catch {
            reject(new Error(`上传失败 (${request.status})`));
          }
        }
      });

      request.addEventListener('error', () => {
        reject(new Error('网络错误，无法连接到服务器'));
      });

      request.addEventListener('abort', () => {
        reject(new Error('上传已取消'));
      });

      request.open('POST', 'http://localhost:3001/api/upload/image');
      request.send(formData);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '上传失败';
    console.error('❌ 上传错误:', message);
    return {
      success: false,
      message,
      error: message,
    };
  }
};

/**
 * 上传多个图片到服务器
 * @param files 要上传的文件列表
 * @param onProgress 上传进度回调
 * @returns 上传响应
 */
export const uploadImages = async (
  files: File[],
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    // 检查后端是否可用
    const healthCheck = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
    }).catch(() => null);

    if (!healthCheck || !healthCheck.ok) {
      throw new Error('后端服务未启动');
    }

    const request = new XMLHttpRequest();

    if (onProgress) {
      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percent,
          });
        }
      });
    }

    return new Promise((resolve, reject) => {
      request.addEventListener('load', () => {
        if (request.status === 200) {
          try {
            const response = JSON.parse(request.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('服务器响应格式错误'));
          }
        } else {
          try {
            const error = JSON.parse(request.responseText);
            reject(new Error(error.message || `上传失败 (${request.status})`));
          } catch {
            reject(new Error(`上传失败 (${request.status})`));
          }
        }
      });

      request.addEventListener('error', () => {
        reject(new Error('网络错误'));
      });

      request.open('POST', 'http://localhost:3001/api/upload/images');
      request.send(formData);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '上传失败';
    console.error('上传错误:', message);
    return {
      success: false,
      message,
    };
  }
};

/**
 * 检查后端上传服务是否可用
 */
export const checkUploadService = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
};

export default {
  uploadImage,
  uploadImages,
  checkUploadService,
};







