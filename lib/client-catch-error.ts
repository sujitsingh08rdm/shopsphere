import { message } from "antd";
import { isAxiosError } from "axios";

const ClientCatchError = (err: unknown) => {
  if (isAxiosError(err)) {
    message.error(err.response?.data.message || err.message);
    return;
  }

  if (err instanceof Error) {
    message.error(err.message);
    return;
  }

  message.error("An Unknown Error occured");
};

export default ClientCatchError;
