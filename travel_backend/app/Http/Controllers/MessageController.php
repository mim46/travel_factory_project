<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // User: Get all messages for logged-in user
    public function myMessages(Request $request)
    {
        $messages = Message::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    // User: Send new message to admin
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'user_id' => $request->user()->id,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => 'Message sent successfully!',
            'data' => $message,
        ], 201);
    }

    // User: Mark message as read
    public function markAsRead($id, Request $request)
    {
        $message = Message::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $message->update(['is_read' => true]);

        return response()->json([
            'message' => 'Message marked as read',
        ]);
    }

    // Admin: Get all messages from all users
    public function index()
    {
        $messages = Message::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    // Admin: Reply to message
    public function reply(Request $request, $id)
    {
        $request->validate([
            'admin_reply' => 'required|string',
        ]);

        $message = Message::findOrFail($id);
        $message->update([
            'admin_reply' => $request->admin_reply,
            'is_replied' => true,
        ]);

        return response()->json([
            'message' => 'Reply sent successfully!',
            'data' => $message,
        ]);
    }

    // Admin: Delete message
    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully!',
        ]);
    }
}