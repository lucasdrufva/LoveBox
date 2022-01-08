import {useCallback} from 'react';
import axios from 'axios';

import {baseUrl, useAuth} from '../AuthProvider';

const usePostTextStatus = device => {
  const auth = useAuth().auth;

  const postTextStatus = useCallback(
    textStatus => {
      return axios
        .post(baseUrl + '/user/device/' + device + '/status/text', textStatus, {
          auth: auth,
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    [device, auth],
  );

  return postTextStatus;
};

const usePostImageStatus = device => {
  const auth = useAuth().auth;

  const postImageStatus = useCallback(
    (image, notifier) => {
      if (image == null) {
        console.log('null image');
        return;
      }

      const data = new FormData();
      data.append('file', {
        name: image.fileName,
        type: image.type,
        uri: image.uri,
      });
      data.append('notifier', notifier);

      return axios.post(
        baseUrl + '/user/device/' + device + '/status/image',
        data,
        {
          auth: auth,
        },
      );
    },
    [device, auth],
  );

  return postImageStatus;
};

export {usePostTextStatus, usePostImageStatus};
