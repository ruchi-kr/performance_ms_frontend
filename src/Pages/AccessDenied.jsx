import React from 'react'

const AccessDenied = () => {
    return (
        <>
            <div className='d-flex justify-content-center align-items-center flex-column' style={{ height: "100vh" }}>
                <h1 className="text-center text-danger display-5">Permission Denied</h1><br />
                <h5 className='text-center'>You do not have permission to access this page. Please contact your administrator.</h5>

            </div>

        </>
    )
}

export default AccessDenied