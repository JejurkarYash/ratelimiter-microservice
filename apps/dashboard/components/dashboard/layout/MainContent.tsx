import React from 'react'

const MainContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex-1 overflow-y-auto dashboard-scroll  p-6  ml-24  ">
            {children}
        </main>
    )
}

export default MainContent