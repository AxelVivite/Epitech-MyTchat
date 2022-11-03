import React, { ReactElement } from 'react';

const PageNotFound = function PageNotFound(): ReactElement<unknown, string> | null {
  return (
    <div className="Test">
      <text>404 Not found</text>
    </div>
  );
};

export default PageNotFound;
