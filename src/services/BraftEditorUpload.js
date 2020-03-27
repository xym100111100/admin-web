import braftEditorUpload from '../utils/BraftEditorUploadUtils';

export async function upload(param) {
  return braftEditorUpload(param.value, `/ise-svr/ise/upload?moduleName=${param.moduleName}`, 'POST');
}
