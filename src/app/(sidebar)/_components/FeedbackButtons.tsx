import { useFeedback } from "@/hooks/useFeedback";
import { BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs";

interface FeedbackButtonsProps {
  question: string;
  answer: string;
  userId: string;
}

const FeedbackButtons = ({ question, answer, userId }: FeedbackButtonsProps) => {
  const { feedbackSent, sendingFeedback, sendFeedback } = useFeedback();

  const handleFeedback = async (thumbs: number) => {
    await sendFeedback({
      user: userId,
      question,
      answer,
      thumbs,
    });
  };

  return (
    <div className="flex items-center gap-3 mt-3">
      <button
        onClick={() => handleFeedback(1)}
        disabled={sendingFeedback || feedbackSent !== null}
        className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          feedbackSent === 1 
            ? 'bg-green-100 text-green-600 border-2 border-green-200' 
            : 'hover:bg-green-50 text-gray-500 hover:text-green-600 border-2 border-gray-200 hover:border-green-200'
        } ${(sendingFeedback || feedbackSent !== null) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        title="This response was helpful"
      >
        <BsHandThumbsUp className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => handleFeedback(0)}
        disabled={sendingFeedback || feedbackSent !== null}
        className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          feedbackSent === 0 
            ? 'bg-red-100 text-red-600 border-2 border-red-200' 
            : 'hover:bg-red-50 text-gray-500 hover:text-red-600 border-2 border-gray-200 hover:border-red-200'
        } ${(sendingFeedback || feedbackSent !== null) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        title="This response was not helpful"
      >
        <BsHandThumbsDown className="w-4 h-4" />
      </button>
      
      {feedbackSent !== null && (
        <span className="text-sm text-gray-500 ml-2 font-medium">
          Thanks for your feedback! 👍
        </span>
      )}
    </div>
  );
};

export default FeedbackButtons; 