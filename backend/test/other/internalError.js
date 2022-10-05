import assert from 'assert';
import axios from 'axios';

import Errors from '../../src/errors';

import { url, makeId } from '../utils/utils';

export default () => {
  it('GET on a synchronous route that will crash', async () => {
    try {
      await axios({
        method: 'get',
        url: `${url}/test/internalError/sync`,
      });
    } catch (e) {
      assert.equal(e.response.status, 500);
      assert.equal(e.response.data.error, Errors.InternalError);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('GET on an asynchronous route that will crash', async () => {
    try {
      await axios({
        method: 'get',
        url: `${url}/test/internalError/async`,
      });
    } catch (e) {
      assert.equal(e.response.status, 500);
      assert.equal(e.response.data.error, Errors.InternalError);
      return;
    }

    throw new Error('Call should have failed');
  });
};
