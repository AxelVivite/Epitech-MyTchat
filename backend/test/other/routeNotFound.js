import assert from 'assert';
import axios from 'axios';

import Errors from '../../src/errors';

import { url, makeId } from '../utils/utils';

export default () => {
  it('GET on inexistent route', async () => {
    try {
      await axios({
        method: 'get',
        url: `${url}/${makeId()}`,
      });
    } catch (e) {
      assert.equal(e.response.status, 404);
      assert.equal(e.response.data.error, Errors.RouteNotFound);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('POST on inexistent route', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/${makeId()}`,
      });
    } catch (e) {
      assert.equal(e.response.status, 404);
      assert.equal(e.response.data.error, Errors.RouteNotFound);
      return;
    }

    throw new Error('Call should have failed');
  });

  it('POST on GET route', async () => {
    try {
      await axios({
        method: 'post',
        url: `${url}/login/users`,
      });
    } catch (e) {
      assert.equal(e.response.status, 404);
      assert.equal(e.response.data.error, Errors.RouteNotFound);
      return;
    }

    throw new Error('Call should have failed');
  });
};
