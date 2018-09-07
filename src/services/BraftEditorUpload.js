import braftEditorUpload from '../utils/BraftEditorUploadUtils';

export async function upload(param) {
  return braftEditorUpload(param, 'http://127.0.0.1:20180/ise/upload?moduleName=goodsDetail', 'POST');
}
