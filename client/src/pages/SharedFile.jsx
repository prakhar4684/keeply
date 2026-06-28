import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedFile } from "../services/shareService";

export default function SharedFile() {

    const { token } = useParams();

    const [file, setFile] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadFile = async () => {

            try {

                const data = await getSharedFile(token);

                setFile(data.file);
                setDownloadUrl(data.downloadUrl);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        loadFile();

    }, [token]);

    if (loading) {

        return <h2 style={{ textAlign: "center", marginTop: 100 }}>Loading...</h2>;

    }

    if (!file) {

        return <h2 style={{ textAlign: "center", marginTop: 100 }}>File Not Found</h2>;

    }

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                gap: 20
            }}
        >

            <h1>{file.name}</h1>

            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>

            <button

                onClick={() => window.open(downloadUrl)}

                style={{
                    padding: "12px 25px",
                    cursor: "pointer"
                }}

            >

                Download

            </button>

        </div>

    );

}