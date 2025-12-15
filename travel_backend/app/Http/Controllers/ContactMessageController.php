<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    // Submit contact message (Public)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'subject' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => 'Message sent successfully!',
            'contact' => $message,
        ], 201);
    }

    // Get all messages (Admin only)
    public function index()
    {
        $messages = ContactMessage::latest()->get();
        return response()->json($messages);
    }

    // Mark as read (Admin only)
    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => true]);

        return response()->json([
            'message' => 'Message marked as read!',
            'contact' => $message,
        ]);
    }

    // Delete message (Admin only)
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json(['message' => 'Message deleted successfully!']);
    }
}
