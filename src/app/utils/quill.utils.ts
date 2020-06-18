import { QuillModules } from 'ngx-quill';

/*
 *  Digital Excellence Copyright (C) 2020 Brend Smits
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation version 3 of the License.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You can find a copy of the GNU Lesser General Public License
 *   along with this program, in the LICENSE.md file in the root project directory.
 *   If not, see https://www.gnu.org/licenses/lgpl-3.0.txt
 */
// Import quill and markdown module to support on the fly markdown typing and converting it to styled html.
import Quill from 'quill';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);

/**
 * Class containing utility methods for Quill Editors.
 * See the followwing links for more documentation:
 * https://github.com/KillerCodeMonkey/ngx-quill
 * https://quilljs.com/
 */
export class QuillUtils {

    public static getDefaultModulesConfiguration(): QuillModules {
        const defaultModulesConfiguration: QuillModules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video']
            ],
            markdownShortcuts: {}
        };
        return defaultModulesConfiguration;
    }
}
