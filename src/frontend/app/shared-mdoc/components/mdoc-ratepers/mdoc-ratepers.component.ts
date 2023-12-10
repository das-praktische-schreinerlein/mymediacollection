import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocRatePersonalRecordType} from '../../../../shared/mdoc-commons/model/records/mdocratepers-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {MathUtils} from '@dps/mycms-commons/dist/commons/utils/math.utils';

@Component({
    selector: 'app-mdoc-ratepers',
    templateUrl: './mdoc-ratepers.component.html',
    styleUrls: ['./mdoc-ratepers.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocRatePersonalComponent extends AbstractInlineComponent {
    mdocratepers: MediaDocRatePersonalRecordType;

    @Input()
    public record: MediaDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    calcRate(rate: number): number {
        return MathUtils.calcRate(rate, 15, 5);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.mdocratepers = undefined;
            return;
        }
        this.mdocratepers = this.record['mdocratepers'];
    }
}
