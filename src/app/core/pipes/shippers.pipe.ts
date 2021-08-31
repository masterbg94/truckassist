import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
@Pipe({
    name: 'shippers'
})
export class ShippersPipe implements PipeTransform {
    transform(value: any, controls: FormGroup, shippersList: any[], waypointFormGroup: FormArray, shipperIndx: any): unknown {
        value = [];
        const pickupId = controls.get('pickupId').value;
        const deliveryId = controls.get('deliveryId').value;

        const waypoint_array = [pickupId];

        waypointFormGroup.value.forEach(element => {
            waypoint_array.push(element.shipperId);
        });
        waypoint_array.push(deliveryId);
        let next_val, tempInd, prev_val;
        if ( typeof shipperIndx == 'number' ) {
            tempInd = waypoint_array[shipperIndx + 1];
            prev_val = waypoint_array[shipperIndx];
            next_val = waypoint_array[shipperIndx + 2];
        }

        shippersList.map(item => {
            if ( waypointFormGroup.value.length > 0 ) {
               if ((item.id != prev_val && item.id != next_val) || item.id == tempInd) { value.push(item); }
            } else {
                if ( shipperIndx == 'pickup' ) {
                    if ( item.id != deliveryId ) { value.push(item); }
                } else if ( item.id != pickupId ) { value.push(item); }
            }
        });
        return value;
    }
}
