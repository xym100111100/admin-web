import braftEditorUpload from '../utils/BraftEditorUploadUtils';

export async function upload(param) { 
  return braftEditorUpload(param, '/ise-svr/ise/upload?moduleName=goodsDetail', 'POST');
}
