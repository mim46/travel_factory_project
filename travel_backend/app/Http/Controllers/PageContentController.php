<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\Request;

class PageContentController extends Controller
{
    // Get page content
    public function getPage($page)
    {
        $content = PageContent::getPageContent($page);
        return response()->json($content);
    }

    // Update page content
    public function updatePage(Request $request, $page)
    {
        $request->validate([
            'content' => 'required|array',
        ]);

        PageContent::updatePageContent($page, $request->content);

        return response()->json([
            'message' => ucfirst($page) . ' page updated successfully',
        ]);
    }
}
