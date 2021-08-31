import { ShippersPipe } from './../core/pipes/shippers.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressPipe } from 'src/app/core/pipes/address/address.pipe';
import { HighlightSearchPipe } from 'src/app/core/pipes/highlight-search.pipe';
import { SafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';
import { ShortenPipe } from 'src/app/core/pipes/shorten.pipe';
import { StatusPipePipe } from '../core/pipes/status-pipe.pipe';
import { NumericDirective } from '../core/pipes/input-decimal.pipe';
import { LoadStatusPipe } from '../core/pipes/load-status.pipe';
@NgModule({
  declarations: [AddressPipe, HighlightSearchPipe, ShortenPipe, StatusPipePipe, SafeHtmlPipe, NumericDirective, ShippersPipe, LoadStatusPipe],
  imports: [CommonModule],
  exports: [CommonModule, AddressPipe, HighlightSearchPipe, ShortenPipe, StatusPipePipe, SafeHtmlPipe, NumericDirective, ShippersPipe, LoadStatusPipe],
  providers: [],
})
export class PipesModule {}
