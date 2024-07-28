import Link from "next/link";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function Insurance() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background text-foreground py-8 px-6">
        <div className="container mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <h2 className="text-xl font-bold mb-4">Filter</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Insurance Type</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="pet">Pet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Coverage Level</h3>
                <Slider defaultValue={[50]} max={100} step={10} aria-label="Coverage Level" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Price Range</h3>
                <Slider defaultValue={[25, 75]} max={100} step={5} aria-label="Price Range" className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-primary rounded-full" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-primary rounded-full" />
                </Slider>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Deductible Amount</h3>
                <Slider defaultValue={[500]} max={5000} step={100} aria-label="Deductible Amount" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Policy Term</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-term">Short-Term</SelectItem>
                    <SelectItem value="long-term">Long-Term</SelectItem>
                    <SelectItem value="renewable">Renewable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Discounts and Bundles</h3>
                <Checkbox>Multi-policy Discounts</Checkbox>
                <Checkbox>No-claims Bonuses</Checkbox>
                <Checkbox>Loyalty Discounts</Checkbox>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Network Restrictions (Health)</h3>
                <Checkbox>In-Network Coverage</Checkbox>
                <Checkbox>Out-of-Network Coverage</Checkbox>
                <Checkbox>PPO (Preferred Provider Organization)</Checkbox>
                <Checkbox>HMO (Health Maintenance Organization)</Checkbox>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Special Conditions or Riders</h3>
                <Checkbox>Pre-existing Condition Coverage</Checkbox>
                <Checkbox>Accidental Death</Checkbox>
                <Checkbox>Critical Illness</Checkbox>
              </div>
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Auto Insurance</h3>
              <p className="text-muted-foreground mb-4">Comprehensive coverage for your vehicle.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$99/mo</span>
                <Button>Select Plan</Button>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Home Insurance</h3>
              <p className="text-muted-foreground mb-4">Protect your home and belongings.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$149/mo</span>
                <Button>Select Plan</Button>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Life Insurance</h3>
              <p className="text-muted-foreground mb-4">Secure your family's financial future.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$59/mo</span>
                <Button>Select Plan</Button>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Health Insurance</h3>
              <p className="text-muted-foreground mb-4">Comprehensive medical coverage.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$199/mo</span>
                <Button>Select Plan</Button>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Business Insurance</h3>
              <p className="text-muted-foreground mb-4">Protect your business from risks.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$299/mo</span>
                <Button>Select Plan</Button>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Pet Insurance</h3>
              <p className="text-muted-foreground mb-4">Keep your furry friends healthy.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$29/mo</span>
                <Button>Select Plan</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}