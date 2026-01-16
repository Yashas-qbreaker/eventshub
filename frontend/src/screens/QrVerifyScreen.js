import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useDispatch } from "react-redux";
import { verifyTicket } from "../actions/eventActions";

export default function QrVerifyScreen() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    let scanner;

    const init = async () => {
      try {
        scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
        scanner.render(
          async (text) => {
            if (!mounted) return;
            setError(null);
            setResult(null);
            setScanning(true);
            try {
              const dispatched = await dispatch(verifyTicket(text));
              const data = dispatched?.data ?? dispatched;
              setResult(data);
              // stop scanning after a successful attempt
              setScanning(false);
              await scanner.clear();
            } catch (e) {
              setError(e?.response?.data?.detail || e.message || String(e));
            }
          },
          () => {}
        );
        scannerRef.current = scanner;
      } catch (err) {
        setError(err?.message || String(err));
      }
    };

    init();

    return () => {
      mounted = false;
      if (scannerRef.current && scannerRef.current.clear) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [dispatch]);

  const submitManual = async (e) => {
    e.preventDefault();
    const id = e.target.elements.ticket.value;
    if (!id) return setError("Please enter a ticket id");
    try {
      setError(null);
      setResult(null);
      const dispatched = await dispatch(verifyTicket(id));
      const data = dispatched?.data ?? dispatched;
      setResult(data);
    } catch (e2) {
      setError(e2?.response?.data?.detail || e2.message || String(e2));
    }
  };

  const restartScanner = async () => {
    setError(null);
    setResult(null);
    setScanning(true);
    // re-create scanner by reloading component: simple approach - clear then init again
    if (scannerRef.current && scannerRef.current.clear) {
      await scannerRef.current.clear().catch(() => {});
    }
    window.location.reload(); // simple and reliable fallback to restart scanner UI
  };

  return (
    <div>
      <h3>Verify Ticket</h3>
      <div id="qr-reader" />
      <div className="mt-2">
        {scanning ? <div className="small text-muted">Scanner active — point camera at QR code</div> : <div className="small text-muted">Scanner stopped</div>}
      </div>

      <form className="mt-3" onSubmit={submitManual}>
        <div className="input-group">
          <input name="ticket" className="form-control" placeholder="Enter ticket ID" />
          <button className="btn btn-primary" type="submit">Verify</button>
          <button type="button" className="btn btn-outline-secondary" onClick={restartScanner}>Restart Scanner</button>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-3">{String(error)}</div>}
      {result && (
        <div className={`alert mt-3 ${result.valid ? "alert-success" : "alert-warning"}`}>
          {result.valid ? "Valid" : "Invalid"} — {result.ticket?.event?.title || result.detail}
        </div>
      )}
    </div>
  );
}


