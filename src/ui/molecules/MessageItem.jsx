const MessageItem = ({ message, sender, timestamp, isOwnMessage }) => {
  const senderName = isOwnMessage ? "You" : (sender?.name || sender?.email || "Unknown");
  const time = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[70%] p-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
          isOwnMessage 
            ? "bg-[#00D9FF]" 
            : "bg-white"
        }`}
      >
        {!isOwnMessage && (
          <p className="font-black text-xs text-black mb-1 uppercase">{senderName}</p>
        )}
        <p className="font-medium text-black break-words">{message}</p>
        <span className="text-xs font-bold text-black opacity-60 mt-1 block">
          {time}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
