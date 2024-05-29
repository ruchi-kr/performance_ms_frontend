import React from 'react';

const DTSSkeleton = () => {
  return (
    <>
      <div className="header-skeleton"></div>
      <div className="side-navbar-skeleton"></div>
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row my-5">
              <div className="col-11 mx-auto">
                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Daily Tracking Sheet</h3>
                </div>
                <hr className="bg-primary border-4" />
                <div className="table-skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-skeleton"></div>
    </>
  );
};

export default DTSSkeleton;
