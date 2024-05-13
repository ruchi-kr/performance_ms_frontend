import React from 'react'

const Footer = () => {
    return (
        <>
            <div>
                <footer className="main-footer mt-3 text-dark" id="footer">
                    <strong>Copyright © 2024 <a href="https://adminlte.io">PMS</a>.&nbsp;</strong>
                     All rights reserved.
                    {/* <div className="float-right d-none d-sm-inline-block">
                        <b>Version</b> 3.2.0
                    </div> */}
                </footer>
                {/* Control Sidebar */}
                <aside className="control-sidebar control-sidebar-dark">
                    {/* Control sidebar content goes here */}
                </aside>
                {/* /.control-sidebar */}
            </div>

        </>
    )
}

export default Footer