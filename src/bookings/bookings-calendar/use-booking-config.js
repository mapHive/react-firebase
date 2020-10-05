import { useEffect, useState, useMemo } from "react";

import app from "../base";

const useBookingConfig = () => {
  const [config, setConfig] = useState();
  const [loading, setLoading] = useState(true);
  const dataRef = useMemo(() => app.database().ref("BookingConfig"), []);

  useEffect(() => {
    if (!dataRef) return;

    const handleValue = (snapshot) => {
      setLoading(false);
      setConfig(snapshot.val());
    };

    dataRef.on("value", handleValue);

    return () => {
      dataRef.off("value", handleValue);
    };
  }, [dataRef]);

  return { config, loading };
};

export default useBookingConfig;
