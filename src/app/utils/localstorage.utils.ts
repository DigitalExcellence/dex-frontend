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
 * Enum which defines which localStorage keys are used.
 */
export enum LocalStorageOptions {
    BetaBannerDismissed,
    PrivacyConsentGiven
}

/**
 * Class to communicate with the localStorage via LocalStorageOptions.
 */
export class LocalStorageUtils {

    /**
     * Method to get a value from the localStorage.
     * @param localStorageOption the option to get the value for.
     */
    public static getValue(localStorageOption: LocalStorageOptions): any {
        if (localStorageOption == null) {
            return null;
        }
        return localStorage.getItem(LocalStorageOptions[localStorageOption]);
    }

    /**
     * Method to set a value in the localStorage.
     * @param localStorageOption the option to set the value for.
     * @param value the value to set.
     */
    public static setValue(localStorageOption: LocalStorageOptions, value: any): void {
        localStorage.setItem(LocalStorageOptions[localStorageOption], value.toString());
    }
}
