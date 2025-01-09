const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

// send message
exports.SendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.user._id
        const reciverId = req.params.id;

        const newMessage = await Message.create({
            message,
            senderId,
            reciverId,
        });

        if (!newMessage) {
            return res.status(400).json({ message: "Message not created" });
        }

        let conversation = await Conversation.findOne({
            usersId: { $all: [senderId, reciverId] },
        });

        if (conversation) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        } else {
            conversation = await Conversation.create({
                usersId: [senderId, reciverId],
                messages: [newMessage._id],
            });

            if (!conversation) {
                return res.status(400).json({ message: "Conversation not created" });
            }
        }

        return res.status(200).json({ message: "Message sent successfully", createdAt: newMessage.createdAt});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//get messsage
exports.GetMessage = async (req, res) => {
    try {
      const senderId = req.user._id;
      const reciverId = req.params.id;

      const conversation = await Conversation.findOne({
        usersId: { $all: [senderId, reciverId] },
      }).populate('messages');
  
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" , conversation });
      }
  
      res.status(200).json({ conversation });
  
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};
  
