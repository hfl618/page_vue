import request from '@/api/request'

export const driveApi = {
  getFiles: (path, options = {}) => request.get('/v1/drive/files', { params: { path }, ...options }),
  uploadFile: (formData) => request.post('/v1/drive/upload', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }),
  mkdir: (data) => request.post('/v1/drive/mkdir', data),
  rename: (data) => request.post('/v1/drive/rename', data),
  delete: (keys) => request.delete('/v1/drive/delete', { data: { keys } }),
  updateMetadata: (data) => request.patch('/v1/drive/metadata', data),
  paste: (data) => request.post('/v1/drive/paste', data),
  move: (data) => request.post('/v1/drive/move', data)
}
