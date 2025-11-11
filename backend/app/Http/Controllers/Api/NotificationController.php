<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Command;
use App\Models\OrderNote;

class NotificationController extends Controller
{
    // Get unseen commands and order notes for admin notifications
    public function unseen(Request $request)
    {
        $adminId = $request->user()->id;
        $unseenCommands = Command::whereNull('seen_by_admin')->get();
        $unseenNotes = OrderNote::whereNull('seen_by_admin')->get();
        return response()->json([
            'commands' => $unseenCommands,
            'order_notes' => $unseenNotes,
        ]);
    }

    // Mark command as seen by admin
    public function markCommandSeen(Request $request, $id)
    {
        $adminId = $request->user()->id;
        $command = Command::findOrFail($id);
        $command->seen_by_admin = $adminId;
        $command->save();
        return response()->json(['message' => 'Command marked as seen']);
    }

    // Mark order note as seen by admin
    public function markNoteSeen(Request $request, $id)
    {
        $adminId = $request->user()->id;
        $note = OrderNote::findOrFail($id);
        $note->seen_by_admin = $adminId;
        $note->save();
        return response()->json(['message' => 'Order note marked as seen']);
    }
}
