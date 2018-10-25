export default function BraftEditorUploadUtils(param, url, method) {
  const xhr = new XMLHttpRequest();
  const fd = new FormData();
  const successFn = response => {
    const filePaths = JSON.parse(response.currentTarget.response);
    console.log("上传成功");
    // 假设服务端直接返回文件上传后的地址
    // 上传成功后调用param.success并传入上传后的文件地址
    param.success({
      url: '/ise-svr/files' + filePaths.filePaths[0],
    });
  };

  const progressFn = event => {
    console.log("上传中");
    // 上传进度发生变化时调用param.progress
    param.progress(event.loaded / event.total * 100);
  };

  const errorFn = response => {
    // 上传发生错误时调用param.error
    param.error({
      msg: 'unable to upload.',
    });
  };
  xhr.upload.addEventListener('progress', progressFn, false);
  xhr.addEventListener('load', successFn, false);
  xhr.addEventListener('error', errorFn, false);
  xhr.addEventListener('abort', errorFn, false);

  fd.append('multipartFile', param.file);
  xhr.open(method, url, true);
  xhr.send(fd);
}
