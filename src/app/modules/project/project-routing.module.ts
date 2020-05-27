import { EmbedComponent } from './embed/embed.component';
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

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailsComponent } from "./details/details.component";
import { OverviewComponent } from "./overview/overview.component";
import { EditComponent } from "./edit/edit.component";

const routes: Routes = [
  { path: "overview", component: OverviewComponent },
  { path: "details/:id", component: DetailsComponent },
  { path: "edit/:id", component: EditComponent },
  { path: "embed/:id", component: EmbedComponent},
  { path: "add", loadChildren: () => import("./add/add.module").then((m) => m.AddModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
