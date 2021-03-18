

export default function errorReport(errName, arrMessage, errType = Error)  {

    const err = new errType(arrMessage);

    err.name = errName;

    return err;

}