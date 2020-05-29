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

/**
 * Class containing utility methods for strings.
 */
export class StringUtils {

    /**
     * Method to strip a value from the string.
     * @param stringToStrip the string to strip the value from.
     * @param valueToStrip the value which should be stripped.
     */
    public static stripString(stringToStrip: string, valueToStrip: string): string {
        if (stringToStrip == null || valueToStrip == null || stringToStrip.indexOf(valueToStrip) === -1) {
            return stringToStrip;
        }

        return stringToStrip.replace(valueToStrip, '');
    }

}
