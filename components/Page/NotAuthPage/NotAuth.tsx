import Link from "next/link";

export default function NotAuth() {
  return (
    <div className="bg-black flex flex-col text-center items-center justify-center h-screen">
      <div
        className="flex flex-row text-white text-center items-center justify-center h-screen"
        style={{
          fontFamily:
            'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        <h1
          className="border-r"
          style={{
            display: "inline-block",
            margin: "0 20px 0 0",
            padding: "0 23px 0 0",
            fontSize: "24px",
            fontWeight: 500,
            verticalAlign: "top",
            lineHeight: "49px",
            borderColor: "#4d4d4d",
          }}
        >
          403
        </h1>
        <div style={{ display: "inline-block" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "49px",
              margin: "0",
            }}
          >
            You are not authorized to go to this page
          </h2>
          <Link href="/auth">
            <div
              style={{
                display: "block",
                marginTop: "20px",
                fontSize: "14px",
                color: "#1e90ff",
                textDecoration: "underline",
              }}
            >
              Go to Login Page
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
