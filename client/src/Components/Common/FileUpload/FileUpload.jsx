function FileUpload (file) {
  return new Promise((resolve, reject) => {
    if (file) {
      // MT: Append the file into a form to make it readable by the server.
      const data = new FormData();
      data.append('postImage', file);

      fetch('/api/admin/addImage', {
        method: 'POST',
        credentials: 'include',
        body: data
      }).then(response => response.json()).then(response => {
        if (response.status === 'OK') {
          resolve(response);
        }
        if (response.status === 'ERROR') {
          reject(response);
        }
      });
    }
  });
}

export default FileUpload;
