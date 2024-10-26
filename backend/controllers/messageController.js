import Message from '../models/message.js';
import Conversation from '../models/conversation.js';
import SuspiciousUser from '../models/suspiciousUser.js';

import { getUserSocketId, io } from '../socket/socket.js';
import {v2 as cloudinary} from 'cloudinary';
import axios from 'axios';
import FormData from 'form-data';

const sendMessage = async (req, res) => {
    try {
        const { message, recipientId } = req.body;
        let {img} = req.body;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            members: { $all: [senderId, recipientId] },
        });
        if(!conversation){
            conversation = new Conversation({
                members: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });
            await conversation.save();
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            img: img || '',
        });


        await newMessage.save();
        await conversation.updateOne({
            lastMessage: {
                text: message,
                sender: senderId,
            },
        });

        const drugImgArr = new Set();
        if(img){
            const response = await axios({
                method: "POST",
                url: "https://detect.roboflow.com/drugs-detection/3",
                params: {
                  api_key: "nnCVEh1nkEkwtwnl62o3",
                  image: img,
                },
            });
            const drugs = response.data.predictions;
            drugs.map((drug) => drugImgArr.add(drug.class));
            console.log(drugImgArr);
        }
        const messageId = newMessage._id;
        if(drugImgArr.size > 0){
            let flaggedUser = await SuspiciousUser.findOne({userId: senderId});
            if(flaggedUser){
                flaggedUser.messages.push(messageId);
            } else {
                flaggedUser = new SuspiciousUser({
                    userId: senderId,
                    messages: [messageId],
                });
            }
            await flaggedUser.save();
        }

        const drugTextArr = new Set();
        const data = new FormData();
        data.append('text', message);
        data.append('lang', 'en');
        data.append('categories', 'drug');
        data.append('mode', 'rules');
        data.append('api_user', '657340409');
        data.append('api_secret', 'TKwgai2qQBbJJNRKEDre5QoKXa6NDMVx');
        
        await axios({
            url: 'https://api.sightengine.com/1.0/text/check.json',
            method:'post',
            data: data,
            headers: data.getHeaders()
        })
        .then(function (response) {
            // on success: handle response
            const drugs = response.data.drug.matches;
            drugs.map((drug) => drugTextArr.add(drug.match));
            console.log(drugTextArr);
        })
        .catch(function (error) {
            // handle error
            if (error.response) console.log(error.response.data);
            else console.log(error.message);
        });

        if(drugTextArr.size > 0){
            let flaggedUser = await SuspiciousUser.findOne({userId: senderId});
            if(flaggedUser){
                flaggedUser.messages.push(messageId);
            } else {
                flaggedUser = new SuspiciousUser({
                    userId: senderId,
                    messages: [messageId],
                });
            }
            await flaggedUser.save();
        }
        
        const recipientSocketId = getUserSocketId(recipientId);
        if(recipientSocketId){
            io.to(recipientSocketId).emit('newMessage', newMessage);
        }
        
        return res.status(200).json(newMessage);

    } catch (error) {
        console.error('Error in SendMessage Controller : ', error);
        res.status(500).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { recipientUserId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findOne({
            members: { $all: [userId, recipientUserId] },
        });
        if (!conversation) return res.status(200).json({error: 'No conversation found'});

        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error in getMessages Controller : ', error);
        res.status(500).json({ error: error.message });
    }
}

const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({ members: userId }).populate({
            path: 'members',
            select: 'username fullname profileImg',
        }).sort({ 'createdAt': -1 });

        conversations.forEach((conversation) => {
            conversation.members = conversation.members.filter((member) => member._id.toString() !== userId.toString());
        });
        return res.status(200).json(conversations);
        
    } catch (error) {
        console.error('Error in getConversations Controller : ', error);
        res.status(500).json({ error: error.message });
    }
}

export { sendMessage , getMessages, getConversations };