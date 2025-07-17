import scissorsGif from "../assets/scissors.gif";
import "../styles/loading.css";

const Loading = ({ state }) => {
  const getStatusMessage = () => {
    switch (state) {
      case "saving":
        return "saving board";
      case "uploading":
        return "uploading image";
      case "exporting":
        return "exporting board";
      case "loading":
      default:
        return "loading page";
    }
  };

  return (
    <div className="loading-container">
      <img src={scissorsGif} alt="Loading animation" className="scissors" />

      <div>{getStatusMessage()}</div>

      <div className="dots">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
};

export default Loading;
