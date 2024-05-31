export default function NotAuth() {
    return (
        <div className='bg-black flex flex-row text-white text-center items-center justify-center h-screen' style={{
            fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
        }}>
            <h1 className='border-r' style={{ display: "inline-block", margin: "0 20px 0 0", padding: "0 23px 0 0", fontSize: "24px", fontWeight: 500, verticalAlign: "top", lineHeight: "49px", borderColor: "#4d4d4d" }}>
                403
            </h1>
            <div style={{ display: "inline-block" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 400, lineHeight: "49px", margin: "0" }}>
                    You are not auth to go this page
                </h2>
            </div>
        </div>
    );
}