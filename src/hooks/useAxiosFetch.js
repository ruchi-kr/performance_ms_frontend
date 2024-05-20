import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    // const source = axios.CancelToken.source();
    // const source = controller.source() ;

    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url, {
          //   cancelToken: source.token,
        });

        if (isMounted) {
          console.log("response", response.data.products);
          setData(response.data);
          setIsError(null);
        }
      } catch (error) {
        if (isMounted) {
          setIsError(error.message);
          setData([]);
        }
      } finally {
        isMounted && setIsLoading(false);
      }

      const cleanUp = () => {
        console.log("clean up function");
        isMounted = false;
        controller.abort();
        console.log("cancelling api reqest");
      };

      return cleanUp;
    };
    fetchData(dataUrl);
  }, [dataUrl]);

  return { data, isLoading, isError };
};

export default useAxiosFetch; 
